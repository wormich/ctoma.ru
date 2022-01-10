<?php

namespace Drupal\parser\Form;

use DOMDocument;
use DOMXPath;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;

/**
 * Configure example settings for this site.
 */

class Review extends FormBase {

  private $batch;

  //второй обход по страницам
  private $batch_two;

  //массив отзывов
  private $review;
  //делаем url + оригинальный html

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'parser_review';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Start parser ||||'),
      '#button_type' => 'primary',
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $this->batch = [
      'title' => "Rewiew parser",
      'finished' => [$this, 'finished'],
      'file' => drupal_get_path('module', 'parser') . '/src/Review.php',
    ];

    for( $i= 1 ; $i <= 218 ; $i++ ){//1 218
      $this->batch['operations'][] = [
        [$this, 'parse'],
        array("http://www.ctoma.ru/reviews/?page_12=".$i)
      ];
    }

    batch_set($this->batch);
  }

  /**
   * {@inheritdoc}
   */
  public function parse($url_, &$context) {
    $doc = new DOMDocument();
    $doc->loadHTMLFile($url_);
    $xpath = new DOMXPath($doc);
    $result = [];
    //получаем весь список ссылок
    //
    $url = $xpath->query("//*[contains(@class, 'reply')]//a/@href");
    for ($i = $url->length - 1; $i > -1; $i--) {
      if(strstr($url->item($i)->nodeValue, 'reviews/show/')){
        $this->createNode($url->item($i)->nodeValue, $url_);
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function finished($success, $results, $operations) {
    drupal_set_message("ОК");
  }

  /**
   * {@inheritdoc}
   * Функция для создания нод типа отзывы
   */
  public function createNode($original_url, $sourse_url) {
    $node = Node::create([
      'type'        => 'otzyvy',
      'title'       => 'Отзыв',
      'field_original_html' => $sourse_url,
      'field_originalnyi_url' => $original_url,
      'path' => ['alias' => mb_strimwidth(substr($original_url, 0, -1), 0, 255, "")],
    ]);
    $node->save();
  }
}